import os
import csv
import json

d_csv_file = 'Updated_Deaths_Sheet.csv'
d_json_file = 'Updated_Deaths_Sheet.json'

print(os.getcwd())

# Read CSV file and convert to JSON
data = []
with open(d_csv_file, 'r') as csvfile:
    csvreader = csv.DictReader(csvfile)
    for row in csvreader:
        data.append(row)

# Write JSON file
with open(d_json_file, 'w') as jsonfile:
    json.dump(data, jsonfile, indent=4)

# print(f'CSV file "{csv_file}" has been converted to JSON file "{json_file}".')


c_csv_file = 'medical_cost.csv'
c_json_file = 'medical_cost.json'

# Read CSV file and convert to JSON
data = []
with open(c_csv_file, 'r') as csvfile:
    csvreader = csv.DictReader(csvfile)
    for row in csvreader:
        data.append(row)

# Write JSON file
with open(c_json_file, 'w') as jsonfile:
    json.dump(data, jsonfile, indent=4)

# print(f'CSV file "{csv_file}" has been converted to JSON file "{json_file}".')
