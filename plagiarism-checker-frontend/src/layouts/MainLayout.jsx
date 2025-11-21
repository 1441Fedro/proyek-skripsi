import Navbar from '../components/Navbar'

const MainLayout = ({ children }) => {
    
    return (
        <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-14 pb-8">{children}</main>
        </div>
    );
};

export default MainLayout
