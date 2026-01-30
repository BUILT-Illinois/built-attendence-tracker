import "../assets/Login.css"
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";
import { loginSyncUser } from "../api/users";

function Login() {
    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const profilePic = result.user.photoURL;
            
            localStorage.setItem("user", user.displayName);
            localStorage.setItem("profile", profilePic);

            const backendUser = await loginSyncUser({
                email: user.email,
                name: user.displayName,
                img: user.photoURL,
            });

            console.log("backendUser:", backendUser);

            localStorage.setItem("user_id", backendUser.user_id);
            localStorage.setItem("admin", String(backendUser.admin));
            localStorage.setItem("points", String(backendUser.points || 0));
            localStorage.setItem("position", backendUser.position || "Member");

            // alert(`Welcome ${user.displayName}`)
            window.location.href = '/home';
            
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