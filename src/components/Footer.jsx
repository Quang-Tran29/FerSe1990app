import React, { useEffect } from "react";
import "./Footer.css";

const Footer = () => {
  // Tự động nhúng Font Awesome vào trang nếu chưa có
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
    document.head.appendChild(link);
  }, []);

  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* CỘT 1: GIỚI THIỆU */}
        <div className="footer-section about">
          <h2 className="footer-logo">SuperMarket<span>Shop</span></h2>
          <p>
            Chuyên cung cấp thực phẩm sạch, trái cây tươi và đồ uống giải khát 
            chất lượng cao cho gia đình bạn mỗi ngày.
          </p>
          <div className="social-icons">
            <a href="https://www.facebook.com/share/18Hb7Sxgzt/" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/twngshaf?igsh=Z2NzN3drb2lvN2tp" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" title="Zalo" aria-label="Zalo">
                <i className="fas fa-comment-dots"></i> 
            </a>
            
          </div>
        </div>

        {/* CỘT 2: LINK HỖ TRỢ */}
        <div className="footer-section links">
          <h3>Hỗ trợ khách hàng</h3>
          <ul>
            <li><a href="#">Hướng dẫn mua hàng</a></li>
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Phí vận chuyển</a></li>
            <li><a href="#">Tra cứu đơn hàng</a></li>
          </ul>
        </div>

        {/* CỘT 3: LIÊN HỆ */}
        <div className="footer-section contact">
          <h3>Liên hệ</h3>
          <p><i className="fas fa-map-marker-alt"></i> Hòa Lạc, Thạch Thất, Hà Nội</p>
          <p><i className="fas fa-phone-alt"></i> Hotline: 113</p>
          <p><i className="fas fa-envelope"></i> support@freshshop.vn</p>
          <p><i className="fas fa-clock"></i> Mở cửa: 08:00 - 22:00</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} FreshShop - All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;