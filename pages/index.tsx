import Link from "next/link";

export default function Home() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-24">
            <div className="prose">
                <h1>Samson's Tidy Tuesdays</h1>
                <p>Two-hour data visualizations for the TidyTuesday project</p>
                <ul>
                    <li><Link href="/2022-03-01"><a>2022-03-01: Alternative fuel stations</a></Link></li>
                </ul>
            </div>
        </div>
    );
}