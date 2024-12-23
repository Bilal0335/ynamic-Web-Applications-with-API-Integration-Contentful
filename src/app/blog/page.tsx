import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const getBlogdata = async () => {
  try {
    const blogData = await fetch(
      `https://cdn.contentful.com/spaces/30zidt4sr9zx/entries?access_token=Qcml2w53Up9sStr7T4Kd9XCWanMmcYxf1-3rIc-XGdQ&content_type=blog`,
      { cache: "no-store" }
    );
    if (!blogData.ok) {
      throw new Error("Failed to load data!");
    }
    return blogData.json();
  } catch (error) {
    console.error(error);
    return null; 
  }
};

const Blog = async () => {
  const blogsData = await getBlogdata();

  // Check if there is data before rendering
  if (!blogsData) {
    return <p>Failed to load blog posts.</p>;
  }

  return (
    <div>
      {blogsData.items.map((blog: any) => (
        <div key={blog.sys.id}>
          <h1 className="text-3xl font-bold">{blog.fields.title}</h1>
          <div>
            {/* Ensure the body field is passed correctly for rendering */}
            {documentToReactComponents(blog.fields.body)}
            <br />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blog;
