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
      {blogsData.items.map((blog: any) => {
        // Use find to get a single matching asset for the image
        const blogImage = blogsData.includes.Asset.find(
          (img: any) => img.sys.id === blog.fields.image.sys.id
        );

        // Use find to get a single matching entry for the author
        const author = blogsData.includes.Entry.find(
          (author: any) => author.sys.id === blog.fields.author.sys.id
        );

        // Safely access the image URL
        const imgUrl = blogImage?.fields?.file?.url
          ? `https:${blogImage.fields.file.url}`
          : null;

        // Safely access the author's name
        const authorName = author?.fields?.name || "Unknown Author";

        if (!imgUrl) {
          console.error("Image URL not found for blog:", blog.sys.id);
        }

        return (
          <div key={blog.sys.id}>
            <h1 className="text-3xl font-bold">{blog.fields.title}</h1>
            <h2 className="text-gray-500 font-semibold">By {authorName}</h2> {/* Display author name */}
            <div>
              {/* Render the blog body */}
              <p>{documentToReactComponents(blog.fields.body)}</p>
              <br />
              {/* Render the image or fallback */}
              {imgUrl ? (
                <img src={imgUrl} alt={blog.fields.title} className="w-full" />
              ) : (
                <p>Image not available.</p>
              )}
              <br />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Blog;
