const Contact = () => {
    return (
        <div className='call-to-order'>
            <p className='c-title'>Liên hệ với Vị Rừng</p>

            <div className="phone-lable">
                <p className='phone'>Số điện thoại: <span>0968 922 006</span></p>
                <p className='zalo'>Zalo: <span>0968 922 006</span></p>
            </div>

            <div className='action'>
                <a className="btn btn_call zalo" target="_blank" href="https://zalo.me/0968922006">
                    Zalo
                </a>

                <a className="btn btn_call" href="tel://0968922006">
                    Bấm gọi
                </a>
            </div>
        </div>
    )
}

export default Contact