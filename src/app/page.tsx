import { LoginRequired } from '@/app/lib/auth';

const HomePage = () => {
    return (
        <main>
            <LoginRequired />
            <h1>Тут має бути загальна статистика</h1>
    </main>
    )
}

export  default HomePage;