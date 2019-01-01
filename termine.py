#!/usr/bin/python3
import datetime
import locale

locale.setlocale(locale.LC_ALL, "de_DE")

# for new years, rewrite this
first_date = datetime.datetime(2019, 1, 12, 14, 0, 0)
first_week = 2 # Kalenderwoche von first_day
week_rythm = 2 # alle week_rythm wochen findet das CoderDojo statt.

# compute and print the days
rythm = datetime.timedelta(days=week_rythm*7)
this_date = first_date
week = first_week
while this_date.year == first_date.year:
    print(this_date.strftime("%c"), "KW", week)
    this_date += rythm
    week += week_rythm

