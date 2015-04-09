#!/usr/bin/python  
# -*- coding:utf-8 -*-  

import os, sys
import xml.etree.ElementTree as etree


def getSpawnPoints(res):
        if not os.path.isfile(res):
                print("not found %s" % res)
                return
        
        rootNode = etree.parse(res).getroot()

        for childNode in rootNode:
                if childNode.tag == "layer":
                        if childNode.attrib["name"] == "spawnpoint":
                                width = int(childNode.attrib["width"])
                                height = int(childNode.attrib["height"])
                                print("-------------------------------------------------")
                                #print("map: width=%i, height=%i" % (width, height))
                                for dataNode in childNode:
                                        if dataNode.tag == "data":
                                                tileIndex = 0
                                                totals = {}
                                                spawnInfos = []
                                                
                                                for mapNode in dataNode:
                                                        gid = int(mapNode.attrib["gid"])
                                                        if gid > 0:
                                                                spawnInfos.append((tileIndex, gid))
                                                                
                                                                if gid in totals:
                                                                        totals[gid] += 1
                                                                else:
                                                                        totals[gid] = 1
                                                                        
                                                        tileIndex += 1

                                                keys = list(totals.keys())
                                                keys.sort()
                                                start = 1

                                                newspawnInfos = []
                                                
                                                for info in spawnInfos:
                                                        tileIndex, gid = info
                                                        info = (tileIndex, keys.index(gid) + 1)
                                                        print("(%i, (%i, 0, %i), (0,0,0), 1)," % ((80000 + info[1]) * 1000 + 1, info[0] % width, int(info[0] % height)))
                                                        newspawnInfos.append(info)
                                                        
                                                print("totals=%s" % (str(totals)))

                        if childNode.attrib["name"] == "avatar_spawnpoint": 
                                width = int(childNode.attrib["width"])
                                height = int(childNode.attrib["height"])

                                for dataNode in childNode:
                                        if dataNode.tag == "data":
                                                tileIndex = 0
                                                totals = {}
                                                spawnInfos = []
                                                
                                                for mapNode in dataNode:
                                                        gid = int(mapNode.attrib["gid"])
                                                        if gid > 0:
                                                                spawnInfos.append((tileIndex, gid))
                                                                
                                                                if gid in totals:
                                                                        totals[gid] += 1
                                                                else:
                                                                        totals[gid] = 1
                                                                        
                                                        tileIndex += 1

                                                keys = list(totals.keys())
                                                keys.sort()
                                                start = 1

                                                newspawnInfos = []
                                                
                                                for info in spawnInfos:
                                                        tileIndex, gid = info
                                                        info = (tileIndex, keys.index(gid) + 1)
                                                        print("avatar_spawnpoint = (%i, 0, %i)," % (info[0] % width, int(info[0] % height)))
                                                        newspawnInfos.append(info)
                                                        
                                                  


if __name__ == "__main__":
        getSpawnPoints("cocos2d-js-client/res/img/3/cocosjs_demo_map1.tmx")
