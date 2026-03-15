import sqlite3
from contextlib import contextmanager

DB_PATH = "armatrix.db"


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@contextmanager
def get_db():
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS team_members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                role TEXT NOT NULL,
                bio TEXT NOT NULL,
                photo_url TEXT NOT NULL,
                linkedin_url TEXT,
                github_url TEXT,
                twitter_url TEXT
            )
        """)

        # Seed with sample data if empty
        count = conn.execute("SELECT COUNT(*) FROM team_members").fetchone()[0]
        if count == 0:
            # Using randomuser.me + i.pravatar.cc for realistic portrait photos
            seed_data = [
                (
                    "Aryan Mehta",
                    "CEO & Co-Founder",
                    "Aryan leads Armatrix with a vision to redefine industrial inspection through AI. Previously led ML infrastructure at Siemens' Industry 4.0 division, he brings a rare blend of deep-tech insight and sharp product thinking. He believes the gap between research and production is where most startups die — and where Armatrix was born.",
                    "https://i.pravatar.cc/300?img=11",
                    "https://linkedin.com/in/aryanmehta",
                    "https://github.com/aryanmehta",
                    "https://twitter.com/aryanmehta",
                ),
                (
                    "Priya Nair",
                    "CTO & Co-Founder",
                    "Priya architects the intelligence layer at Armatrix. Holding a PhD in computer vision from IIT Bombay and 8 years in industrial robotics, she has filed 4 patents in real-time defect detection. She runs the ML platform team and still writes production model code every week. The best systems, she says, are the ones engineers are afraid to delete.",
                    "https://i.pravatar.cc/300?img=47",
                    "https://linkedin.com/in/priyanair",
                    "https://github.com/priyanair",
                    "https://twitter.com/priyanair",
                ),
                (
                    "Rohan Kapoor",
                    "Head of Engineering",
                    "Rohan owns the full-stack platform powering Armatrix's inspection suite. A former senior SWE at Razorpay, he brought fintech-grade reliability to deep-tech. He's obsessed with internal developer tooling, zero-downtime deploys, and cutting P99 latencies. His war stories about on-call incidents have become company folklore.",
                    "https://i.pravatar.cc/300?img=12",
                    "https://linkedin.com/in/rohankapoor",
                    "https://github.com/rohankapoor",
                    None,
                ),
                (
                    "Simran Oberoi",
                    "Lead ML Engineer",
                    "Simran trains the neural nets that see what humans miss. She specialises in real-time anomaly detection, model quantisation, and edge deployment on constrained factory hardware. Her team pushed defect recall rates past 99.1% on the production line — an industry first. She codes in Python, thinks in probability distributions.",
                    "https://i.pravatar.cc/300?img=49",
                    "https://linkedin.com/in/simranoberoi",
                    "https://github.com/simranoberoi",
                    "https://twitter.com/simranoberoi",
                ),
                (
                    "Karan Sethi",
                    "Product Design Lead",
                    "Karan translates complex inspection intelligence into interfaces that feel effortless to factory operators. With a background in industrial UX research and a thesis on cognitive load in high-stakes environments, he crafts every pixel to survive the harshest conditions. He runs weekly 'floor visits' — standing in front of clients' machines with a notepad.",
                    "https://i.pravatar.cc/300?img=15",
                    "https://linkedin.com/in/karansethi",
                    None,
                    "https://twitter.com/karansethi",
                ),
                (
                    "Aisha Bose",
                    "Data Infrastructure Engineer",
                    "Aisha builds the data pipelines that feed Armatrix's models. From edge sensor ingestion to cloud feature stores, she ensures petabytes of inspection footage move reliably and fast. A former data engineer at Flipkart Commerce Cloud, she scales infrastructure before it needs scaling. Her on-call runbook is a company-wide reference document.",
                    "https://i.pravatar.cc/300?img=44",
                    "https://linkedin.com/in/aishabose",
                    "https://github.com/aishabose",
                    None,
                ),
                (
                    "Dev Anand",
                    "Computer Vision Engineer",
                    "Dev builds the eyes of Armatrix — real-time vision pipelines that run on NVIDIA Jetson hardware on factory floors with zero tolerance for latency. He has contributed to several open-source CV libraries and holds the record for the fastest model inference benchmark in the Armatrix codebase. He reviews two CV papers every week without fail.",
                    "https://i.pravatar.cc/300?img=17",
                    "https://linkedin.com/in/devanand",
                    "https://github.com/devanand",
                    "https://twitter.com/devanand",
                ),
                (
                    "Neha Sharma",
                    "Customer Success Lead",
                    "Neha bridges the gap between Armatrix's technology and the enterprise teams that depend on it. She owns onboarding, expansion, and retention across Armatrix's top accounts — and feeds every client insight directly into the product roadmap. She was the first non-technical hire at Armatrix. The engineers trust her judgment more than their own backlogs.",
                    "https://i.pravatar.cc/300?img=45",
                    "https://linkedin.com/in/nehasharma",
                    None,
                    "https://twitter.com/nehasharma",
                ),
                (
                    "Vikram Iyer",
                    "ML Research Engineer",
                    "Vikram sits at the boundary of research and production. He adapts state-of-the-art vision transformers for industrial use cases — stripping out what doesn't matter in a factory, doubling down on what does. He interned at Google Brain before joining Armatrix as employee #9. He keeps a ranked list of every architecture he's shipped to production.",
                    "https://i.pravatar.cc/300?img=18",
                    "https://linkedin.com/in/vikramiyer",
                    "https://github.com/vikramiyer",
                    "https://twitter.com/vikramiyer",
                ),
                (
                    "Zara Khan",
                    "Frontend Engineer",
                    "Zara builds the client-facing dashboards that operators stare at for eight-hour shifts. She's obsessed with rendering performance, accessible colour contrast for industrial lighting conditions, and animations that communicate machine state intuitively. She came from the Vercel design systems team and brought that craft mentality to Armatrix.",
                    "https://i.pravatar.cc/300?img=48",
                    "https://linkedin.com/in/zarakhan",
                    "https://github.com/zarakhan",
                    None,
                ),
                (
                    "Mihir Desai",
                    "DevOps & Platform Engineer",
                    "Mihir keeps Armatrix's cloud infrastructure invisible — which is exactly the goal. He manages multi-region Kubernetes clusters, owns the CI/CD pipeline, and maintains a 99.98% uptime SLA for the inspection API. He auto-remediates more incidents than he creates tickets for, and has never missed an on-call rotation in two years.",
                    "https://i.pravatar.cc/300?img=13",
                    "https://linkedin.com/in/mihirdesai",
                    "https://github.com/mihirdesai",
                    None,
                ),
                (
                    "Ananya Rao",
                    "Applied AI Researcher",
                    "Ananya works on the hardest problems in the Armatrix research backlog — the defects that current models misclassify, the edge cases that slip past production filters, and the open questions that don't have benchmarks yet. She publishes openly, speaks at NeurIPS workshops, and maintains Armatrix's internal research digest that the whole company reads on Fridays.",
                    "https://i.pravatar.cc/300?img=46",
                    "https://linkedin.com/in/ananyarao",
                    "https://github.com/ananyarao",
                    "https://twitter.com/ananyarao",
                ),
            ]

            conn.executemany(
                """INSERT INTO team_members (name, role, bio, photo_url, linkedin_url, github_url, twitter_url)
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                seed_data,
            )
