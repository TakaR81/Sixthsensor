import pandas as pd
import MeCab
import os
import json
import codecs
import math
from google.cloud import language_v1
from google.api_core.exceptions import InvalidArgument

import account

class Analyzer:
    def __init__(self):
        """コンストラクタ
        """
        self.pn_dict = None
        self.custom_positive_words = None
        self.custom_negative_words = None
        self.tagger = MeCab.Tagger()
        self.NLclient = language_v1.LanguageServiceClient()


    def loadPnDict(self, file_name="./data/pn_ja.dic"):
        """ _loadPnDict_
        単語感情極性対応表から{単語:pnスコア}のdictをself.pn_dictに保存

        arg:
            file_name(string): 単語感情極性対応表のパス
        """
        pnja = pd.read_csv(file_name,
                        sep=":",
                        encoding="shift-jis",
                        names=("Word", "Read", "Hinshi", "Score"))
        self.pn_dict = dict(zip(pnja["Word"], pnja["Score"]))


    def loadCustomDict(self, file_name, theme):
        """ loadCustomDict
        迷いの設定に合わせた特定のワード辞書を読み込む．

        args:
            file_name(string): 特定のワード辞書
            theme(string): 迷い設定
        """
        with codecs.open(file_name, "r", "utf-8") as f:
            json_data = json.load(f)
        
        if theme in json_data:
            self.custom_positive_words = json_data[theme]["positive"]
            self.custom_negative_words = json_data[theme]["negative"]
        else:
            print("loadCustomDict Error: the theme is not in custom-dict-file.")
        

    def _morphologicalAnalyze_(self, text):
        """morphologicalAnalyze
        形態素解析関数

        args:
            text(string): 解析する文章
        return:
            morpheme_list(list(string)): 分解した形態素のリスト
        """
        if self.tagger is None:
            print("please run self.loadSetting()")
            return []

        #形態素解析
        morphemes = self.tagger.parse(str(text))
        morphemes = morphemes.splitlines()

        morpheme_list = []
        
        for morpheme in morphemes:
            splited_morpheme = morpheme.split("\t")
            morpheme_list.append(splited_morpheme[0])

        return morpheme_list


    def pnDictScore(self, text):
        """ pnDictScore
        1文章のPNを計算．（加算）

        args:
            text(string): tweet
        return:
            score(float): pnスコア
        """
        score = 0
        morpheme_list = self._morphologicalAnalyze_(text)
        for morpheme in morpheme_list:
            if self.pn_dict.get(morpheme) is not None:
                word_pn_score = self.pn_dict[morpheme]

                if word_pn_score < 0:
                    word_pn_score = word_pn_score * 0.2
                else:
                    word_pn_score = word_pn_score * 1
                
                score += word_pn_score

        return score


    def gcnlScore(self, text):
        """ gcnlScore
        Google Cloud Natural Langageを使って，1文章のPNを計算．（加算）
        
        args:
            text(string): tweet
        return:
            score(float): pnスコア
        """
        text = str(text)
        document = language_v1.Document(content=text, type_=language_v1.Document.Type.PLAIN_TEXT)
        
        try:
            #テキストからPNを分析
            sentiment = self.NLclient.analyze_sentiment(request={'document': document}).document_sentiment
            #文章内のPN値の平均を抽出
            score = sentiment.score
        except :
            print("except text : ", text)
            score = 0
        
        return score


    def pnWordBias(self, text):
        """ pnWordBias
        迷いの設定に合わせた特定のワード辞書を参照し，補正値を計算して返す．

        arg:
            text(string): ツイート内容
        return:
            bias(flaot): 補正値 (-0.5~0.5)
            
        """
        positive_word_num = 0
        negative_wird_num = 0
        morpheme_list = self._morphologicalAnalyze_(text)
        for morpheme in morpheme_list:
            if morpheme in self.custom_positive_words:
                positive_word_num += 1
            elif morpheme in self.custom_negative_words:
                negative_wird_num += 1
        
        a = max(positive_word_num, negative_wird_num)
            / positive_word_num + negative_wird_num
        bias = 1 / (1 + math.exp(-1 * a * (p - n))) - 0.5
        return bias







def main():
    import sys

    user = account.Account(sys.argv[1])
    ana = Analyzer()
    ana.loadSetting()
    for id_, timeline in user.getTimeline(100, 1).items():
        text=timeline["tweet"]
        print("tweet:\n", text)

        #極性辞書で分析
        #score = ana.pnDictScore(text)

        #Natural Language APIで分析
        score = ana.gcnlScore(text)

        print("score:", score)


if __name__ == "__main__":
    main()
