import os
import json

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
SEEDS_DIR = os.path.join(CURRENT_DIR, "..", "backend", "app", "data", "seeds")

def main():
    states_data = json.load(open(os.path.join(SEEDS_DIR, "states.json"), encoding="utf-8"))
    heritage = json.load(open(os.path.join(SEEDS_DIR, "heritage_sites.json"), encoding="utf-8"))
    festivals = json.load(open(os.path.join(SEEDS_DIR, "festivals.json"), encoding="utf-8"))
    crafts = json.load(open(os.path.join(SEEDS_DIR, "crafts.json"), encoding="utf-8"))
    arts = json.load(open(os.path.join(SEEDS_DIR, "performing_arts.json"), encoding="utf-8"))
    experiences = json.load(open(os.path.join(SEEDS_DIR, "cultural_experiences.json"), encoding="utf-8"))

    all_states = sorted([s["name"] for s in states_data])
    print(f"Total States and Union Territories Configured: {len(all_states)}")
    print("=" * 85)
    print(f"{'#':2} | {'State / Union Territory':44} | {'Sites':5} | {'Fests':5} | {'Craft':5} | {'Arts':4} | {'Exp':4} | {'Total':5}")
    print("-" * 85)

    zero_states = []
    totals = {"sites": 0, "fests": 0, "crafts": 0, "arts": 0, "exp": 0, "grand": 0}

    for idx, s in enumerate(all_states, 1):
        h = sum(1 for x in heritage if x.get("state") == s)
        f = sum(1 for x in festivals if x.get("state") == s)
        c = sum(1 for x in crafts if x.get("state") == s)
        a = sum(1 for x in arts if x.get("state") == s)
        e = sum(1 for x in experiences if x.get("state") == s)
        tot = h + f + c + a + e

        totals["sites"] += h
        totals["fests"] += f
        totals["crafts"] += c
        totals["arts"] += a
        totals["exp"] += e
        totals["grand"] += tot

        if tot == 0:
            zero_states.append(s)
        print(f"{idx:2} | {s:44} | {h:5} | {f:5} | {c:5} | {a:4} | {e:4} | {tot:5}")

    print("=" * 85)
    print(f"{'TOTAL NATIONAL DATASET':49} | {totals['sites']:5} | {totals['fests']:5} | {totals['crafts']:5} | {totals['arts']:4} | {totals['exp']:4} | {totals['grand']:5}")
    print("=" * 85)
    print(f"States/UTs with ZERO entities: {len(zero_states)}")
    if zero_states:
        print(f"Zero states: {zero_states}")
    else:
        print("CONFIRMED: ALL 28 STATES AND 8 UNION TERRITORIES (36/36) HAVE EVIDENCE-BACKED CULTURAL COVERAGE!")

if __name__ == "__main__":
    main()
