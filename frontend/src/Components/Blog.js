const Blog = ({ blog }) => {
  return (
    <div style={{ padding: "10px", margin: "10px", border: "1px solid #ccc" }}>
      {blog.title}{" "}
      <div
        style={{
          color: "gray",
          fontWeight: "bold",
        }}
      >
        {blog.author}
      </div>
    </div>
  );
};

export default Blog;
