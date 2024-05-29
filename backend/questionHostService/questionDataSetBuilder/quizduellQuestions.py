import json

categoryList = ["Buecher_und_Woerter", "Comics", "Computerspiele", "Die_2000er", "Draussen_im_Gruenen", "Essen_und_Trinken", "Glaube_und_Religion", "Im_Labor", "Kinofilme", "Koerper_und_Geist", "Kunst_und_Kultur", "Macht_und_Geld", "Medien_und_Unterhaltung", "Musik_und_Hits", "Rund_um_die_Welt", "Sport_und_Freizeit", "TV-Serien", "Wunder_der_Technik", "Zeugen_der_Zeit"]


def replaceChars(line: str):
    new_line = line.replace('´', "").replace("Antwort: ", "").replace("\n", " ").replace("'", "")
    return new_line


def parseTextfiletoJson(category):

    question = { "question":"", "correct":"", "false1":"", "false2":"", "false3":"" }

    allQuestions = [question]

    with open("backend/questionHostService/questionDataSetBuilder/textFiles/"+category+".txt", encoding='utf-8') as textfile:
        savedLine = ""
        
        for line in textfile.readlines():
            question = { "question":"", "correct":"", "false1":"", "false2":"", "false3":"" }

            if ("?" not in line and "Antwort:" not in line and len(line) > 1):
                savedLine += line
            elif ("?" in line):
                savedLine += line
                    
                if (allQuestions[len(allQuestions)-1].get("question") == ""):
                    allQuestions[len(allQuestions)-1]["question"] = replaceChars(savedLine.strip())
                else:
                    question["question"] = replaceChars(savedLine.strip())
                    allQuestions.append(question)
            elif ("Antwort:" in line):
                savedLine = ""
                if (allQuestions[len(allQuestions)-1].get("correct") == ""):
                    allQuestions[len(allQuestions)-1]["correct"] = replaceChars(line.strip())
                else:
                    question["correct"] = replaceChars(line.strip())
                    allQuestions.append(question)
        
        fileDict = { "category":category, "questionCount":len(allQuestions), "questionList":allQuestions }
        json_object = json.dumps(fileDict, indent=4, ensure_ascii=False)
        with open("backend/questionHostService/questionDataSetBuilder/jsonFiles/"+"noA_"+category+".json", "w", encoding='utf-8') as outfile:
            outfile.write(json_object)


def main():
    for category in categoryList:
        parseTextfiletoJson(category)







if __name__ == '__main__':
    main()
    