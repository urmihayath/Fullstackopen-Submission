import React, { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [uname, setUname] = useState("");
  const [pass, setPass] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({ uname, pass });

      setUser(user);
      setUname("");
      setPass("");
    } catch (exception) {
      console.log("Wrong Credentials");
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="uname">Username</label>
          <input
            type="text"
            name="uname"
            id="uname"
            value={uname}
            onChange={(e) => {
              setUname(e.target.value);
            }}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />
        </div>

        <button>Login</button>
      </form>

      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
