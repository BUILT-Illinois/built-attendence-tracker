import "../assets/Login.css"
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";

function Login() {
    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const profilePic = result.user.photoURL;
            
            localStorage.setItem("user", user.displayName);
            localStorage.setItem("profile", profilePic);

            // alert(`Welcome ${user.displayName}`)
            window.location = '/home';
            
        } catch (error) {
            alert(error.message);
        }
    }
    
    return(
        <div className="attendance-container">
            <div className="core">
                <h1>
                    Attendance Tracker
                </h1>

                <img src="https://built-illinois.org/built-logo.png"/>

                <button className="butt" onClick={loginWithGoogle}>
                    Login &rarr;
                </button>
            </div>
            
        </div>
    );
}

export default Login;