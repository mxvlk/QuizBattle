import os
import json

# Function to generate SQL insert queries
def generate_sql_inserts(json_data, category_name):
    category_insert = f"INSERT INTO category (name) VALUES ('{category_name}');\n"
    question_list = json_data["questionList"]
    question_inserts = []
    for question_data in question_list:
        question_text = question_data["question"]
        correct_answer = question_data["correct"]
        false_answer1 = question_data["false1"]
        false_answer2 = question_data["false2"]
        false_answer3 = question_data["false3"]

        question_insert = f"INSERT INTO question (question_text, correct_answer, false_answer1, false_answer2, false_answer3, category_id) VALUES "
        question_insert += f"('{question_text}', '{correct_answer}', '{false_answer1}', '{false_answer2}', '{false_answer3}', (SELECT id FROM category WHERE name = '{category_name}'));\n"
        question_inserts.append(question_insert)

    return category_insert + "".join(question_inserts)

# Function to generate SQL statements for table creation
def generate_table_creation():
    category_table = """
CREATE TABLE IF NOT EXISTS category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);\n\n"""

    question_table = """
CREATE TABLE IF NOT EXISTS question (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    false_answer1 TEXT NOT NULL,
    false_answer2 TEXT NOT NULL,
    false_answer3 TEXT NOT NULL,
    category_id INTEGER REFERENCES category(id)
);\n\n"""

    return category_table + question_table

# Function to process JSON files and generate SQL file
def generate_sql_file(directory):
    table_creation = generate_table_creation()
    sql_inserts = ""

    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            filepath = os.path.join(directory, filename)
            with open(filepath, "r") as json_file:
                json_data = json.load(json_file)
                category_name = json_data["category"]
                sql_inserts += generate_sql_inserts(json_data, category_name)

    with open("backend/questionDatabase/insert_data.sql", "w") as sql_file:
        sql_file.write(table_creation)
        sql_file.write(sql_inserts)

sub_directory_path = "backend/questionHostService/questionDataSetBuilder/jsonFilesWithAnswers"
generate_sql_file(sub_directory_path)