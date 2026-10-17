import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { StoreProvider } from './context/Store';
import Layout from './components/Layout';
import Catalog, { Categories } from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import { Login, Register, Profile } from './pages/Account';
import { Cart, Checkout } from './pages/Cart';
import Order from './pages/Order';
import { About, Blog, BlogDetail, Contact } from './pages/Information';
import {
    AdminLayout,
    Dashboard,
    CrudList,
    CrudForm,
    Orders,
    Reports,
} from './pages/Admin';
export default function App() {
    return (
        <StoreProvider>
            <HashRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<Catalog home />} />
                        <Route path="productos" element={<Catalog />} />
                        <Route
                            path="productos/:id"
                            element={<ProductDetail />}
                        />
                        <Route path="categorias" element={<Categories />} />
                        <Route
                            path="categorias/:categoryId"
                            element={<Catalog />}
                        />
                        <Route path="ofertas" element={<Catalog offers />} />
                        <Route path="registro" element={<Register />} />
                        <Route path="login" element={<Login />} />
                        <Route path="perfil" element={<Profile />} />
                        <Route path="nosotros" element={<About />} />
                        <Route path="blog" element={<Blog />} />
                        <Route path="blog/:id" element={<BlogDetail />} />
                        <Route path="contacto" element={<Contact />} />
                        <Route path="carrito" element={<Cart />} />
                        <Route path="checkout" element={<Checkout />} />
                        <Route
                            path="compra/exitosa"
                            element={<Order success />}
                        />
                        <Route
                            path="compra/error"
                            element={<Order failure />}
                        />
                        <Route path="pedidos/:id" element={<Order />} />
                        <Route path="admin" element={<AdminLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route
                                path="criticos"
                                element={
                                    <CrudList collection="products" critical />
                                }
                            />
                            <Route path="reportes" element={<Reports />} />
                            <Route path="pedidos" element={<Orders />} />
                            <Route
                                path="usuarios/:id/compras"
                                element={<Orders history />}
                            />
                            {[
                                ['productos', 'products'],
                                ['categorias', 'categories'],
                                ['usuarios', 'users'],
                            ].map(([route, collection]) => (
                                <Route key={route} path={route}>
                                    <Route
                                        index
                                        element={
                                            <CrudList collection={collection} />
                                        }
                                    />
                                    <Route
                                        path="nuevo"
                                        element={
                                            <CrudForm
                                                key={collection + '-new'}
                                                collection={collection}
                                            />
                                        }
                                    />
                                    <Route
                                        path=":id/editar"
                                        element={
                                            <CrudForm
                                                key={collection + '-edit'}
                                                collection={collection}
                                            />
                                        }
                                    />
                                </Route>
                            ))}
                        </Route>
                        <Route
                            path="*"
                            element={
                                <div className="container py-5">
                                    <h1>Página no encontrada</h1>
                                    <Link to="/">Volver al inicio</Link>
                                </div>
                            }
                        />
                    </Route>
                </Routes>
            </HashRouter>
        </StoreProvider>
    );
}
