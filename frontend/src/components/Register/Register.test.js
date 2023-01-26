import { render, screen } from '@testing-library/react';
import Register from './Register';

const mockFunction = () => { };


it('renders registration form with username/password/repeat password/submit', () => {
    render(<Register
        show={mockFunction}
        close={mockFunction}
        switchTo={mockFunction}
        setUser={mockFunction}
        setDB={mockFunction}
    />);

    expect(screen.getByRole("form", { name: "Register" })).toHaveTextContent(/Register/);
    expect(screen.getByLabelText(/Username/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Repeat password/)).toBeInTheDocument();
    expect(screen.getByRole("button", {type: "submit"})).toBeInTheDocument();
})
