import './PokeHome.css';

export default function PokeHome() {
    return (
        <section className="poke-home">
            <div className="poke-home__hero">
                <p className="poke-home__eyebrow">Hello, trainer!</p>
                <h1 className="poke-home__title">Welcome to my Pokemon page!</h1>
                <p className="poke-home__lead">
                    This is a React application powered by PokeAPI. You can browse a list of
                    Pokemon, open each one for more details, and add your favorites to your own
                    Pokemon collection.
                </p>
            </div>

            <div className="poke-home__content">
                <p>
                    This is a fan app and I am not making any profit from the Pokemon brand name.
                </p>
                <p>
                    The Pokemon you add to your collection are saved in local storage on your own
                    device. That means if you open this page on another device or browser, your
                    saved collection will not appear there.
                </p>
                <p>
                    The app does not collect any information from you. I hope you enjoy it!
                </p>
            </div>

            <p>If you no longer wish to store data in the local storage of your device, <button
                    aria-label="Clear local storage from this app"
                    title="Clear local storage from this app"
                    onClick={() => localStorage.clear()}
                    >click here</button>, then exit the app.</p>
            <p className="poke-home__contact">
                <a href="mailto:chuot2008@gmail.com">Contact the developer</a>
            </p>
        </section>
    )
}