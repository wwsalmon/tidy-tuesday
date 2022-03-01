import "../styles/globals.css";

function MyApp({Component, pageProps}) {
    return (
        <>
            <Component {...pageProps} />
            <div className="h-16 flex items-center px-4 fixed bottom-0 left-0 w-full bg-white z-10">
                <p>Made by <a href="https://www.samsonzhang.com" className="underline">Samson Zhang</a> -- see <a href="https://github.com/wwsalmon/tidy-tuesday" className="underline">code on GitHub</a></p>
            </div>
        </>
    );
}

export default MyApp;
