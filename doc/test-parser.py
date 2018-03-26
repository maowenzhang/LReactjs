import os
import json
import re
import pprint

# Notes: use python3 to handle unicode chars

class TestParser:
    def __init__(self, testFile, outputFile):
        self.testFile = testFile
        self.outputFile = outputFile

        self.data = {}
        self.data['title'] = ''
        self.data['description'] = ''
        self.data['items'] = []
    
    def parseDISC(self, contents):
        self.data['title'] = 'DISC性格测试题完整版'
        des1 = '开始测试：在每一个大标题中的四个选择题中只选择一个最符合你自己的，并在英文字母后面做记号。一共40题。不能遗漏。 '
        des2 = '注意：请按第一印象最快的选择，如果不能确定，可回忆童年时的情况，或者以你最熟悉的人对你的评价来从中选择。 '
        self.data['description'] = [des1, des2]

        pattern = '([1-4])([^0-4|D|S|I|C]+)([D|S|I|C])'
        results = re.findall(pattern, contents)
        print(len(results))
        assert(len(results) == 160)
        # pprint.pprint(results)
        for i in range(40):
            item = {}
            item['order'] = i + 1 
            pos = i * 4
            # print(pos)
            options = results[pos:pos+4]
            newOptions = []
            for option in options:
                adjustedOption = list(option)
                adjustedOption = [x.strip(' ；。') for x in adjustedOption]
                newOptions.append(adjustedOption)
            # print(options)
            item['options'] = newOptions
            self.data['items'].append(item)

    def parse(self):
        f = open(self.testFile, 'r')
        contents = f.read()
        f.close()
        self.parseDISC(contents)

    def toJSON(self):
        with open(self.outputFile, 'w') as f:
            json.dump(self.data, f, ensure_ascii=False)
        print('\n--- Save data to file: ', self.outputFile)


if __name__ == '__main__':
    testFile = 'disc-test.txt'
    outputFile = 'disc-test.json'
    parser = TestParser(testFile, outputFile)
    parser.parse()
    parser.toJSON()
    