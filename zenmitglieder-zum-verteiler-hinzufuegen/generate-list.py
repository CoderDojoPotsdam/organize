import os

files = [file for file in os.listdir(".") if file.lower().endswith(".csv")]
files.sort()

def entries_file(file):
    return file[:-4] + ".txt"

def read_file(file):
    print(file)
    if os.path.isfile(entries_file(file)):
        with open(entries_file(file)) as f:
            return [line.strip() for line in f]
    entries = []
    with open(file) as f:
        lines = iter(f)
        for heading in lines:
            break
        for user in lines:
            print(repr(user))
            name, email = user.split(",")[:2]
            name = name.strip('"').strip()
            email = email.strip('"').strip()
            if not email:
                continue
            entries.append(name + " <" + email + ">")
    return entries

entries = list(map(read_file, files))
for entry, file in zip(entries, files):
    if not os.path.isfile(entries_file(file)):
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
                if i % 10 == 9:
                    # one can only invite 10 people at once
                    f.write("\n")
                
            

