

const Footer = () => {
    return (

        <footer className="bg-[#2B5659] w-full h-40 flex items-center justify-evenly">

            <div className="footer-title">
                <p className="text-[16px] sm:text-[16px] md:text-[24px] font-bold">Tutor Track</p>
            </div>
            {/* line */}
            <div className="w-px h-4/5 bg-[#FFFFFF]" />

            <div className="footer-info h-18">
                <div className='flex h-1/3 w-auto mb-5'>
                    <img src="/images/envelope 1.svg" className="mx-2" />
                    <p className='px-2'>s111234567@stu.ntue.edu.tw</p>
                </div>
                <div className='flex h-1/3 w-auto '>
                    <img src="/images/mail 1.svg" className="mx-2" />
                    <p className='px-2'>(02)2732-1104</p>
                </div>
            </div>
            {/* line */}
            <div className="w-px h-4/5 bg-[#FFFFFF]" />

            <div className="footer-icons flex">
                <img src="/images/fb 1.svg" className="mx-2" />
                <img src="/images/ig 1.svg" className="mx-2" />
                <img src="/images/x 1.svg" className="mx-2" />
                <img src="/images/yt 1.svg" className="mx-2" />
            </div>
        </footer>
    );
};

export default Footer;