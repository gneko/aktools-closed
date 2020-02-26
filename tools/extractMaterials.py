# -*- coding: UTF-8 -*-

import re
import json
import requests

# 在根目录下执行以下指令:
# python3 ./tools/extractMaterials.py

# https://github.com/Kengxxiao/ArknightsGameData.git
base = "https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/zh_CN/gamedata"

# 某次更新后上面所用的数据出现了乱码问题，可以clone到本地后手动修复，此时需要用以下路径
# base = r"C:\Users\user\ArknightsGameData\zh_CN\gamedata"

def readJson(path):
    if base.startswith("http"):
        r = requests.get(base + path
        # 如果需要可以取消注释以使用代理，请注意socks5代理需要 pip3 install -U requests[socks]
        # , proxies = { 'http': 'socks5://127.0.0.1:1086', 'https': 'socks5://127.0.0.1:1086'}
        )
        r.encoding = "utf-8"
        return r.json()
    else:
        with open(base + path, encoding='utf-8') as f:
            return json.load(f, encoding='utf-8')

skillTbl = readJson("/excel/skill_table.json")
skidToName = {}
for skid in skillTbl:
    skidToName[skid] = skillTbl[skid]['levels'][0]['name']

charTbl = readJson("/excel/character_table.json")
result = {}
profMap = {
    'MEDIC': '医疗',
    'WARRIOR': '近卫',
    "PIONEER": '先锋',
    'TANK': '重装',
    'SNIPER': '狙击',
    'CASTER': '术师',
    'SUPPORT': '辅助',
    'SPECIAL': '特种'
}

with open("./src/assets/data/charMaterials.json", "r", encoding="utf-8") as f:
    oldData = json.load(f)
    print("Before update: {0} char-mats".format(len(oldData)))

newChars = []
for chid in charTbl:
    char = charTbl[chid]
    chmat = {
        'name': char['name'],
        'rarity': char['rarity'],
        'profession': profMap.get(char['profession'], '其它'),
        'evolveCosts': [x['evolveCost'] for x in char['phases']],
        'sskillCosts': [
            {
                'skillName': skidToName[x['skillId']] if x['skillId'] else "",
                'levelUpCost': x['levelUpCostCond'],
                'unlockCond':x['unlockCond']
            } for x in char['skills']],
        'askillCosts': char['allSkillLvlup'],
    }
    result[char['name']] = chmat
    if char['name'] not in oldData:
        newChars.append(char['name'])


with open("./src/assets/data/charMaterials.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False)
    print("After update: {0} char-mats".format(len(result)))
    if len(newChars) > 0:
        print("New chars: {0}".format(", ".join(newChars)))