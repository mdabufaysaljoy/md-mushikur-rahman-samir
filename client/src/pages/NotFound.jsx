import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[80vh] flex-col items-center justify-center text-center">
      <p className="gradient-text text-8xl font-bold">404</p>
      <h1 className="mt-4 text-2xl text-white">This page drifted out of orbit</h1>
      <Link to="/" className="btn-primary mt-8">Back home</Link>
    </div>
  );
}
