import {NextSeo} from "next-seo";
import Header from "../components/Header";
import TaxStatusGraph from "../components/2022-04-05/TaxStatusGraph";
import BubbleVis from "../components/2022-04-05/BubbleVis";

export default function NewsVis() {

    return (
        <>
            <NextSeo title="April 5: new local news | Samson's Tidy Tuesdays"/>
            <Header title="US digital-native local news publications"/>
            <div className="flex items-center justify-center pb-32">
                <TaxStatusGraph/>
            </div>
            <BubbleVis/>
        </>
    )
}