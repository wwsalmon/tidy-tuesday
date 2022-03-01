import Link from "next/link";
import {NextSeo} from "next-seo";

export default function Home() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-24">
            <NextSeo title="Samson's Tidy Tuesdays"/>
            <div className="prose">
                <h1>Samson's Tidy Tuesdays</h1>
                <p>
                    Two-hour data visualizations for the R for Data Science <a href="https://github.com/rfordatascience/tidytuesday">#tidytuesday project</a> (but I make them in Python, D3, and React :P)
                </p>
                <ul>
                    <li><Link href="/2022-03-01"><a>2022-03-01: Alternative fuel stations</a></Link></li>
                </ul>
            </div>
        </div>
    );
}