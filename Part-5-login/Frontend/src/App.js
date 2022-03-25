import React, { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState([""]);
  const [author, setAuthor] = useState([""]);
  const [url, setUrl] = useState([""]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");

    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
    }
  }, []);

  const handleAddBlog = (e) => {
    e.preventDefault();
    const newBlog = {
      title: title,
      author: author,
      url: url,
    };

    blogService.create(newBlog).then((returnedObject) => {
      setBlogs(blogs.concat(returnedObject));
      setTitle("");
      setAuthor("");
      setUrl("");
    });

    console.log(blogs);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedUser", JSON.stringify(user));

      loginService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      console.log("Wrong Credentials");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    setUser(null);
  };

  return (
    <div>
      {user === null && (
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <button>Login</button>
        </form>
      )}

      {user !== null && (
        <div>
          <p>
            <b>{user.name}</b> is logged in
            <button onClick={handleLogout}>logout</button>
          </p>

          <h1>Create New Blog</h1>
          <form onSubmit={handleAddBlog}>
            <div className="title">
              <label htmlFor="title">title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
            <div className="author">
              <label htmlFor="author">author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                }}
              />
            </div>
            <div className="url">
              <label htmlFor="url">url</label>
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
              />
            </div>
            <button>create</button>
          </form>

          <h2>blogs</h2>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
