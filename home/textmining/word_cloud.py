#coding: utf-8
from PIL import Image
import numpy as np
from matplotlib import pyplot as plt
from wordcloud import WordCloud
import requests
import MeCab
import re
import sys
import matplotlib.cm as cm
import matplotlib.colors as mcolors
from matplotlib.colors import ListedColormap
import seaborn as sns, numpy as np
from ipywidgets import interact, FloatSlider
import random
import codecs
#
import oseti
analyzer = oseti.Analyzer()
MAPSIZE = 12
cmap = ListedColormap(sns.color_palette('cool', MAPSIZE)) #coolwarm/cool/bwr/RdYlBu_r




# pn_ja.dicファイルから、単語をキー、極性値を値とする辞書を得る
def load_pn_dict():
    dic = {}
    with codecs.open('./pn_ja.dic', 'r', 'shift_jis') as f:
        lines = f.readlines()

        for line in lines:
            # 各行は"良い:よい:形容詞:0.999995"
            columns = line.split(':')
            dic[columns[0]] = float(columns[3])
    return dic



# これが単語ごとに色をだす関数
def color_func(word, font_size, position, orientation, random_state=None,
                   **kwargs):

    if word in pn_dic:
        pn_score = pn_dic[word]
        #print(word, pn_score, ((pn_score + 1)/2)*0.7*MAPSIZE)
        pn_score = int(round(((pn_score + 1) / 2)*0.95*MAPSIZE, 0))
        if pn_score > 0 :
            return '#ee82ee'
        else :
            return '#87cefa'
    else:
        pn_score = int(MAPSIZE / 2)
        return '#87cefa'
       
    #rgb = cmap(pn_score)
    #return mcolors.rgb2hex(rgb)
    

#ワードクラウド作成関数(日本語テキスト版)
def create_wordcloud_ja(text):
    fontpath = './Oshidashi-M-Gothic-TT.ttf'
    stop_words_ja = ['もの', 'こと', 'とき', 'そう', 'たち', 'これ', 'よう', 'これら', 'それ', 'すべて']
    #形態素解析
    tagger = MeCab.Tagger() 
    tagger.parse('') 
    node = tagger.parseToNode(text)

    word_list = []
    while node:
        word_type = node.feature.split(',')[0]
        word_surf = node.surface.split(',')[0]
        if word_type == '名詞' and word_surf not in stop_words_ja:
            word_list.append(node.surface)
        node = node.next
    word_chain = ' '.join(word_list)
    wordcloud = WordCloud(background_color="white",
                          font_path=fontpath,
                          width=1600,
                          height=900,
                          contour_width=1,
                          max_words=156,
                          max_font_size=512,
                          min_font_size=16,
                          contour_color="black",
                          color_func=color_func,
                          stopwords=set(stop_words_ja)).generate(word_chain)

    wordcloud.to_file("wc_test_bp.png")

#必要ファイルの呼び出し
#テキストの読み込み
with open('text.txt', 'r', encoding='utf-8') as fi:
    text = fi.read()



pn_dic = load_pn_dict()
create_wordcloud_ja(text)
