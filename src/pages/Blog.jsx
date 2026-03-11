import React, { useState, useMemo, useEffect } from "react";
import "./Blog.css";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  // Chống cuộn trang khi đang mở Modal
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedPost]);

  const [posts] = useState([
    {
      id: 1,
      title: "5 Cách Chọn Hoa Quả Tươi Ngon Không Ngâm Hóa Chất",
      excerpt: "Làm sao để phân biệt táo nhập khẩu thật và táo kém chất lượng?",
      content: "1. Kiểm tra cuống quả: Cuống tươi là quả mới hái.\n2. Màu sắc: Không nên quá bóng bẩy.\n3. Mùi hương: Hoa quả tự nhiên luôn có mùi thơm dịu.\n4. Độ cứng: Cầm chắc tay, không bị mềm nhũn.",
      image: "https://picsum.photos/id/102/600/400",
      date: "10/05/2024",
      author: "Admin"
    },
    {
      id: 2,
      title: "Lợi Ích Của Việc Uống Nước Ép Trái Cây Mỗi Sáng",
      excerpt: "Nước ép không chỉ giúp đẹp da mà còn cung cấp vitamin thiết yếu...",
      content: "Uống nước ép giúp cơ thể bù nước và nạp năng lượng nhanh chóng. Các loại nước ép như cam, táo, cà rốt rất giàu chất chống oxy hóa, giúp làn da sáng khỏe và tăng cường hệ miễn dịch.",
      image: "https://picsum.photos/id/429/600/400",
      date: "12/05/2024",
      author: "Minh Anh"
    }
  ]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, posts]);

  return (
    <div className="blog-container">
      <header className="blog-header">
        <h1>Cẩm nang <span>Sống Khỏe</span></h1>
        <div className="blog-search-wrapper">
          <input 
            type="text" 
            placeholder="Tìm kiếm bài viết..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="blog-search-input"
          />
        </div>
      </header>

      <div className="blog-grid">
        {filteredPosts.map((post) => (
          <article key={post.id} className="blog-card">
            <div className="blog-image">
              <img src={post.image} alt={post.title} />
              <span className="blog-date">{post.date}</span>
            </div>
            <div className="blog-content">
              <span className="blog-author">Bởi: {post.author}</span>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <button className="read-more" onClick={() => setSelectedPost(post)}>
                Đọc thêm
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* --- PHẦN MODAL (CỬA SỔ GIỮA MÀN HÌNH) --- */}
      {selectedPost && (
        <div className="blog-modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="blog-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedPost(null)}>&times;</button>
            
            <img src={selectedPost.image} alt={selectedPost.title} className="modal-image" />
            
            <div className="modal-text">
              <span className="blog-author">Bởi: {selectedPost.author} | {selectedPost.date}</span>
              <h1>{selectedPost.title}</h1>
              <hr />
              <div className="full-content">
                {selectedPost.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;