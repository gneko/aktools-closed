# -*- coding: UTF-8 -*-

import re
import json
import requests
import time
# 在根目录下执行以下指令:
# python3 ./tools/extractStages.py

# https://github.com/Kengxxiao/ArknightsGameData.git
base = "https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/%s/gamedata"
# "en_US","ja_JP","ko_KR","zh_CN"
# 某次更新后上面所用的数据出现了乱码问题，可以clone到本地后手动修复，此时需要用以下路径
# base = r"C:\Users\user\ArknightsGameData\zh_CN\gamedata"

servers = ["en_US", "ja_JP", "ko_KR", "zh_CN"]
newData = {"allStage": [], "preset": {},"ActivityName":{}}

datafile = "./src/static/data/StageList.json"

def readJson(path, server="zh_CN"):
    if base.startswith("http"):
        r = requests.get(base % server + path
                         # 如果需要可以取消注释以使用代理，请注意socks5代理需要 pip3 install -U requests[socks]
                         # , proxies = { 'http': 'socks5://127.0.0.1:1080', 'https': 'socks5://127.0.0.1:1080'}
                         )
        r.encoding = "utf-8"
        return r.json()
    else:
        with open(base + path, encoding='utf-8') as f:
            return json.load(f, encoding='utf-8')


def addId(stage):
    output = {"stageId": stage[0], "code": stage[1]["code"],
              "drop": stage[1]["displayMainItem"]}  # 排除龙门币关
    return output


def removeTR(stage):
    # 去除剿灭作战和教程关/突袭模式/超难关/龙门币支线关/物资筹备
    if re.search(r"(TR-\d+|H\d+-\d+|PR-[A-Z]-\d+|LS-\d+|SK-\d+|CA-\d+|AP-\d+|CE-\d+)", stage["code"]):
        return False
    if not re.search("-", stage["code"]):
        return False
    if re.search("#f#", stage["stageId"]):
        return False
    return True


def checkActivityOpen(stage):
    stage["stageId"].split("-")[0]
    if StageRawData["stageValidInfo"].__contains__(stage["stageId"]):
        StageTime = StageRawData["stageValidInfo"][stage["stageId"]]
        if(time.time() > StageTime["startTs"] and (StageTime["endTs"] == -1 or time.time() < StageTime["endTs"])):
            # 这里也许要考虑时区?
            return True
        return False
    return True


# See: https://stackoverflow.com/questions/25851183/how-to-compare-two-json-objects-with-the-same-elements-in-a-different-order-equa
def ordered(obj):
    if isinstance(obj, dict):
        return sorted((k, ordered(v)) for k, v in obj.items())
    if isinstance(obj, list):
        return sorted(ordered(x) for x in obj)
    else:
        return obj


with open(datafile, "r", encoding="utf-8") as f:
    oldData = json.load(f)


for server in servers:
    StageRawData = readJson("/excel/stage_table.json", server)
    StageRawData["stages"] = list(
        filter(removeTR, map(addId, StageRawData["stages"].items())))
    if(server == "zh_CN"):
        ActivityRawData = readJson("/excel/activity_table.json", server)
        for Stage in StageRawData["stages"]:
            if(ActivityRawData["basicInfo"].__contains__(Stage["stageId"].split("_")[0])):
                StageCode=Stage["code"].split("-")[0]
                newData["ActivityName"][StageCode]=ActivityRawData["basicInfo"][Stage["stageId"].split("_")[0]]["name"]
        newData["allStage"] = list(
            map(lambda a: a["code"], StageRawData["stages"]))
    newData["preset"][server] = list(
        map(lambda a: a["code"], filter(checkActivityOpen, StageRawData["stages"])))

if ordered(oldData) != ordered(newData):
    with open(datafile, "w", encoding="utf-8") as f:
        json.dump(newData, f, ensure_ascii=False)
    print("关卡数据", end="")
