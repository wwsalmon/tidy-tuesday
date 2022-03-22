import Link from "next/link";

export default function Header({title}: {title: string}) {
    return (
        <div className="text-center my-8">
            <Link href="/"><a className="mb-4">Back home</a></Link>
            <h1 className="text-2xl font-bold">{title}</h1>
        </div>
    );
}