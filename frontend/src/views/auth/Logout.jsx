import React, {useEffect} from 'react'
import { logout } from '../../utils/auth'
import { Link } from 'react-router-dom'

const Logout = () => {

  useEffect(()=>{
    logout()
  }, [])
  return (
    <>
     <main className="" style={{ marginBottom: "100px", marginTop: "50px" }}>
        <div className="container">
          {/* Section: Login form */}
          <section className="">
            <div className="row d-flex justify-content-center">
              <div className="col-xl-5 col-md-8">
                <div className="card rounded-5">
                  <div className="card-body p-4 text-center">
                    <h4 className='mb-4'>You've been logged out</h4>
                    <Link to="/register" className='btn btn-primary'>Register</Link>
                    <Link to="/login" className='btn btn-primary ms-2'>Login</Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main> 
    </>
  )
}

export default Logout