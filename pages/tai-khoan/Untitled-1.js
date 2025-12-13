// ANHOME SCRIPT LẤY THÔNG TIN

(async function () {

    /***********************
     * AUTO SCROLL 10 GIÂY
     ***********************/
    async function autoScroll() {
        return new Promise(resolve => {
            let lastCount = 0;
            let sameCountTime = 0;
            const CHECK_INTERVAL = 1000;
            const LIMIT = 10000;

            const interval = setInterval(() => {
                window.scrollTo(0, document.body.scrollHeight);

                const currentCount = document.querySelectorAll(".content-room").length;

                if (currentCount === lastCount) {
                    sameCountTime += CHECK_INTERVAL;
                } else {
                    sameCountTime = 0;
                }

                lastCount = currentCount;

                if (sameCountTime >= LIMIT) {
                    clearInterval(interval);
                    resolve();
                }
            }, CHECK_INTERVAL);
        });
    }

    /***********************
     * LẤY TEXT TIỆN LỢI
     ***********************/
    function getText(el, selector) {
        const node = el.querySelector(selector);
        return node ? node.innerText.trim() : "";
    }

    /***********************
     * XOÁ SỐ NHÀ
     * Ví dụ:
     * "190-192 Đinh Bộ Lĩnh..." → "Đinh Bộ Lĩnh..."
     ***********************/
    function removeHouseNumber(address) {
        if (!address) return "";
        return address.replace(/^\s*\d[\d\/\-A-Za-z]*\s+/, "");
    }

    /***********************
     * LẤY GIÁ TRỊ THEO LABEL
     ***********************/
    function getRowValue(item, label) {
        const spans = [...item.querySelectorAll(".small span")];
        const found = spans.find(s => s.innerText.trim().startsWith(label));
        if (!found) return "";
        return found.nextElementSibling ? found.nextElementSibling.innerText.trim() : "";
    }

    /***********************
     * BẮT ĐẦU SCROLL
     ***********************/
    console.log("⏳ Đang scroll toàn trang...");
    await autoScroll();
    console.log("✅ Scroll xong! Bắt đầu lấy dữ liệu...");

    /***********************
     * QUÉT TOÀN BỘ PHÒNG
     ***********************/
    const rooms = [...document.querySelectorAll(".content-room")];
    const results = [];

    rooms.forEach(room => {
        const image = room.querySelector("img")?.src || "";

        let address = getText(room, ".span-address");
        address = removeHouseNumber(address);

        const price = getText(room, ".fw-700");

        const block = [
            `Cho thuê phòng tại ${address}. Giá cho thuê: ${price}. Điện: ${getRowValue(room, "Điện:")}/kWh. Nước: ${getRowValue(room, "Nước:")}/ng. `,
            `Xe: ${getRowValue(room, "Xe:")}/xe. Quản lý: ${getRowValue(room, "Quản lý:")}/ng. Wifi: ${getRowValue(room, "Wifi:")}. Máy giặt: ${getRowValue(room, "M.giặt:")}/ng`,
            `Thẻ: ${getRowValue(room, "Thẻ:")}/ng. Phí DV: ${getRowValue(room, "Phí DV:")}. Phòng: ${getRowValue(room, "Phòng:")}. Vị trí: ${getRowValue(room, "Vị trí:")}`,
            `Diện tích: ${getRowValue(room, "Diện tích:")}. Toilet: ${getRowValue(room, "Toilet:")}. Để xe: ${getRowValue(room, "Để xe:")}. Sân phơi: ${getRowValue(room, "Sân phơi:")}`,
            `Khóa cổng: ${getRowValue(room, "Khóa cổng:")}. Giờ giấc: ${getRowValue(room, "Giờ giấc:")}. SL xe: ${getRowValue(room, "SL xe:")}. SL người: ${getRowValue(room, "SL người:")}`,
            `Cọc giữ chổ: ${getRowValue(room, "Cọc giữ chổ:")}. Hẹn bổ sung cọc: ${getRowValue(room, "Hẹn bổ sung cọc:")}. Hẹn dọn vào: ${getRowValue(room, "Hẹn dọn vào:")}`,
            `FILE_URL: ${image}`
        ].join("\n");

        results.push(block);
    });

    /***********************
     * TẠO NÚT COPY KẾT QUẢ
     ***********************/
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy Room Data";
    copyBtn.style.position = "fixed";
    copyBtn.style.top = "10px";
    copyBtn.style.right = "10px";
    copyBtn.style.zIndex = 99999;
    copyBtn.style.padding = "10px 20px";
    copyBtn.style.background = "#0a84ff";
    copyBtn.style.color = "#fff";
    copyBtn.style.border = "none";
    copyBtn.style.borderRadius = "5px";
    copyBtn.style.cursor = "pointer";
    copyBtn.style.fontSize = "14px";

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(results.join("\n\n")).then(() => {
            alert("Đã copy toàn bộ dữ liệu phòng!");
        });
    };

    document.body.appendChild(copyBtn);

    console.log("🎉 Hoàn thành! Đã tạo nút Copy.");
})();

