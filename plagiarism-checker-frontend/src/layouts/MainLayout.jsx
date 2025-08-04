import Navbar from '../components/Navbar'

const MainLayout = ({ children }) => {
    return (
        <>
        <Navbar />
        <main className="p-8">{children}</main>
        </>
    )
}

export default MainLayout
