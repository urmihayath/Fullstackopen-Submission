/* eslint-disable no-lone-blocks */
import { useEffect, useState } from "react";
import Blog from "./Components/Blog";
import blogService from "./Services/blogs";
import loginService from "./Services/login";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // New Blogs state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs);
    });
  }, []);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedBlogAppUser");

    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
    } catch (exception) {
      setErrorMessage("Wrong Credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
  };

  const createBlog = (event) => {
    event.preventDefault();

    const blogObject = {
      title: title,
      author: author,
      url: url,
      id: blogs.length + 1,
    };
    console.log(blogObject);

    blogService.create(blogObject).then((response) => {
      setBlogs(blogs.concat(response));
      console.log(2);
      setTitle("");
      setAuthor("");
      setUrl("");
    });
  };

  if (user === null) {
    return (
      <div>
        <h2>{errorMessage}</h2>
        <form onSubmit={handleLogin}>
          <div>
            username{" "}
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password{" "}
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>

      <p>
        Logged In user : {user.username}
        <button type="submit" onClick={handleLogout}>
          logout
        </button>
      </p>
      <h2>Write new blog</h2>
      <form onSubmit={createBlog}>
        <div>
          title:{" "}
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:{" "}
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:{" "}
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
}

export default App;
