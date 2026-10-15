import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Link,
  NavLink,
  Outlet,
  Route,
  Routes,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import './App.css'

const API_URL = 'https://fakestoreapi.com/products'

function Layout() {
  return (
    <>
      <header>
        <Link className="logo" to="/">Mini Store</Link>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  )
}

function Home() {
  return (
    <section>
      <h1>Mini Store</h1>
      <p>A simple React store using routing and an API.</p>
      <Link className="button" to="/products">See products</Link>
    </section>
  )
}

function About() {
  return (
    <section>
      <h1>About</h1>
      <p>This is a single-page application built for the routing laboratory.</p>
    </section>
  )
}

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category')
  const sort = searchParams.get('sort')
  const search = searchParams.get('search')?.toLowerCase() || ''

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) throw new Error('Request failed')
        return response.json()
      })
      .then(setProducts)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Unable to load product.</p>

  let visibleProducts = category
    ? products.filter((product) => product.category === category)
    : products

  if (search) {
    visibleProducts = visibleProducts.filter((product) =>
      product.title.toLowerCase().includes(search),
    )
  }

  if (sort === 'price') {
    visibleProducts = [...visibleProducts].sort((a, b) => a.price - b.price)
  }

  return (
    <section>
      <h1>Products</h1>

      <div className="filters">
        <Link to="/products">All</Link>
        <Link to="/products?category=electronics">Electronics</Link>
        <Link to="/products?sort=price">Sort by price</Link>
        <Link to="/products?search=phone">Search phone</Link>
      </div>

      <div className="product-grid">
        {visibleProducts.map((product) => (
          <article className="card" key={product.id}>
            <img src={product.image} alt={product.title} />
            <h2>{product.title}</h2>
            <p>${product.price}</p>
            <Link className="button" to={`/products/${product.id}`}>
              View details
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error('Request failed')
        return response.json()
      })
      .then(setProduct)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Loading...</p>
  if (error || !product) return <p>Unable to load product.</p>

  return (
    <section className="details">
      <h1>Product details</h1>
      <img src={product.image} alt={product.title} />
      <div>
        <h2>{product.title}</h2>
        <p><strong>${product.price}</strong></p>
        <p>{product.description}</p>
        <Link className="button" to="/products">Back to products</Link>
      </div>
    </section>
  )
}

function Dashboard() {
  return (
    <section>
      <h1>Dashboard</h1>
      <nav className="subnav">
        <NavLink end to="/dashboard">Overview</NavLink>
        <NavLink to="profile">Profile</NavLink>
        <NavLink to="settings">Settings</NavLink>
      </nav>
      <Outlet />
    </section>
  )
}

function DashboardHome() {
  return <p>Dashboard overview.</p>
}

function Profile() {
  return <p>Profile page.</p>
}

function Settings() {
  return <p>Settings page.</p>
}

function NotFound() {
  return (
    <section>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link className="button" to="/">Home</Link>
    </section>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />

          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
