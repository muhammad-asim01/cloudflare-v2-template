export default async function ProductPage({ params }: { params: { id: string } }) {
    // Using JSONPlaceholder API for testing
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`, {
      cache: 'no-store', // Ensures fresh data every request (SSR)
    });
  
    if (!res.ok) {
      return <div>Error loading product</div>;
    }
  
    const product = await res.json();
  
    return (
        <div>Product ID: {product?.title}</div>
    );
  }
  