import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Logic from './Logic';

export default function LandingPage() {

    let history = useHistory();

    useEffect(() => {
        history.push('/login');
    }, []);

    return (
        <>
            <Logic/>
            <main className="hm-main">
                <section className="hm-main-about">
                    <div className="hm-main-about--header">
                        {/* <h3>Podziel się </h3> */}
                    </div>
                </section>
                <section className="hm-main-getstart">
                    <div className="hm-main-getstart--box">
                        <h5>Rozpocznij teraz</h5>
                        <Link to="/signup">Stwórz Konto</Link>
                    </div>
                </section>
            </main>
        </>
    )
}