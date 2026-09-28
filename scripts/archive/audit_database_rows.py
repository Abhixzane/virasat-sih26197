import sqlite3

def main():
    conn = sqlite3.connect("virasat.db")
    c = conn.cursor()
    tables = [t[0] for t in c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").fetchall()]
    print("Database Row Counts in virasat.db:")
    total = 0
    for t in sorted(tables):
        cnt = c.execute(f"SELECT count(*) FROM {t}").fetchone()[0]
        total += cnt
        print(f"  {t:24}: {cnt:5}")
    print("-" * 35)
    print(f"  TOTAL RELATIONAL ROWS   : {total:5}")

if __name__ == "__main__":
    main()
