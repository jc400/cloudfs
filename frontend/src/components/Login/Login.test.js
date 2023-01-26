import { render, screen } from '@testing-library/react';
import Login from './Login';

const mockFunction = () => { };


it('renders login form with username/password/submit', () => {
    render(<Login
        show={mockFunction}
        close={mockFunction}
        switchTo={mockFunction}
        setUser={mockFunction}
        setDB={mockFunction}
    />);

    expect(screen.getByRole("form", { name: "Login" })).toHaveTextContent(/Log in/);
    expect(screen.getByLabelText(/Username/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    expect(screen.getByRole("button", {type: "submit"})).toBeInTheDocument();
})
