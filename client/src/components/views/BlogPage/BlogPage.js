import { use } from "passport";
import React, { useEffect, useState } from "react";
import {
  Header,
  Grid,
  Comment,
  Form,
  Button,
  Segment,
  Card,
  Input,
  Divider,
} from "semantic-ui-react";
import "./BlogPage.css";
import MainNavbar from "../NavBar/MainNavbar";

function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");

  useEffect(() => {
    fetch("/api/blogPost/getBlogPosts")
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setBlogPosts(res.blogPosts);
      });
  }, []);

  useEffect(() => {
    // fetch("/api/blogPost/newBlogPosts", {
    //   method: "POST",
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     console.log(res);
    //   });
  }, []);

  var handlePostSubmit = (e) => {
    fetch("/api/blogPost/newBlogPosts", {
      method: "POST",
      body: JSON.stringify({
        title: newPostTitle,
        body: newPostBody,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        fetch("/api/blogPost/getBlogPosts")
          .then((res) => res.json())
          .then((res) => {
            setBlogPosts(res.blogPosts);
          });
      });
  };

  return (
    <div className="blog">
      <MainNavbar />
      <Grid centered paded className="bgBlog">
        <Header
          size="large"
          style={{ color: "white", margin: "auto", marginTop: "3rem" }}
        >
          {" "}
          Blogs{" "}
        </Header>
      </Grid>
      <Grid.Row centered>
        <Form>
          <Grid.Row>
            <Input
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="blog title"
              style={{ minWidth: 400, marginBottom: "1rem" }}
            ></Input>
            <Button
              Secondary
              basic
              inverted
              color="red"
              style={{ marginBottom: "0.9rem" }}
              onClick={handlePostSubmit}
            >
              Post
            </Button>
          </Grid.Row>
          <Grid.Row>
            <textArea
              onChange={(e) => setNewPostBody(e.target.value)}
              placeholder="Write your blog here"
              style={{ minWidth: 400, marginBottom: "1.5rem" }}
            />
          </Grid.Row>
        </Form>
        <Divider />
      </Grid.Row>
      <Grid
        columns={2}
        paded
        style={{ marginLeft: "9rem", marginRight: "9rem" }}
      >
        <Grid.Row>
          {blogPosts.map((post) => {
            return (
              <Grid.Column>
                <Card
                  style={{
                    minWidth: 600,
                    marginBottom: "1.5rem",
                  }}
                >
                  <Card.Content style={{ textAlign: "center" }}>
                    <Card.Header>{post.title}</Card.Header>
                    <Card.Description>{post.body}</Card.Description>
                    <Card.Meta>
                      <span>{post.author}</span>
                      <span>{post.category}</span>
                    </Card.Meta>
                  </Card.Content>
                </Card>
              </Grid.Column>
            );
          })}
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default Blog;
