#!/usr/bin/python
# coding: utf-8
import os

HERE = os.path.dirname(__file__)

files = [os.path.join(HERE, file) for file in os.listdir(HERE) if file.lower().endswith(".csv")]
files.sort()

def entries_file(file):
    return file[:-4] + ".txt"

def format_entry(s):
    return s.strip('"').strip()
    
def read_file(file):
    entries = []
    with open(file) as f:
        lines = iter(f)
        for heading in lines:
            headers = [format_entry(s).lower() for s in heading.split(",")]
            break
        name_index = headers.index("name")
        email_index = headers.index("email")
        for user in lines:
            entry = user.split(",")
            name = format_entry(entry[name_index])
            email = format_entry(entry[email_index])
            if not email:
                continue
            entries.append(name + " <" + email + ">")
    return entries

entries = list(map(read_file, files))
for entry, file in zip(entries, files):
    new_entries = set(entry)
    for entry2 in entries:
        if entry2 is not entry:
            new_entries -= set(entry2)
    new_entries = list(new_entries)
    new_entries.sort(key=lambda s: s.lower())
    with open(entries_file(file), "w") as f:
        content = iter(new_entries)
        for i, c in enumerate(content):
            f.write(c)
            f.write(",\n")
            print("{},".format(c))
            if i % 10 == 9:
                # one can only invite 10 people at once
                f.write("\n")
                print("")
                
print('''

Hallo, 

dies ist eine Einladung in den CoderDojo Potsdam Mailverteiler. Wenn Du die Einladung annimmst, erhältst Du Erinnerungen und Neuigkeiten zum CoderDojo und ähnlichen Veranstaltungen.

Viele Grüße,
Nicco
''')
