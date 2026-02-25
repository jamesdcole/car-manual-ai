export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      color: 'white',
      fontFamily: 'system-ui'
    }}>
      <div style={{ 
        textAlign: 'center', 
        maxWidth: '500px',
        padding: '40px 30px',
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '24px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 8vw, 4rem)', 
          marginBottom: '20px',
          textShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          🚗 Car Manual AI
        </h1>
        <h2 style={{ 
          fontSize: '1.8rem', 
          marginBottom: '30px',
          opacity: 0.95
        }}>
          🔥 ROUTING CONFIRMED WORKING
        </h2>
        <div style={{ 
          background: 'rgba(255,255,255,0.2)', 
          padding: '25px', 
          borderRadius: '16px', 
          marginBottom: '35px',
          fontSize: '1.2rem',
          lineHeight: 1.6
        }}>
          <div>✅ Next.js App Router = Active</div>
          <div>✅ Vercel Deployment = Fresh</div>
          <div>✅ Single page.js = Correct</div>
        </div>
        <button 
          onClick={() => {
            alert('🎉 PAGE.JS WORKS PERFECTLY!\n\nFirebase Auth login coming next!');
            document.body.style.background = '#10b981';
          }}
          style={{
            padding: '18px 50px',
            background: 'linear-gradient(45deg, #4285f4, #34a853)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontSize: '1.3rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 12px 35px rgba(66,133,244,0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          🚀 TEST PAGE WORKS!
        </button>
        <p style={{ 
          marginTop: '30px', 
          fontSize: '0.95rem', 
          opacity: 0.8 
        }}>
          Click → Green background = Routing 100% → Firebase next!
        </p>
      </div>
    </div>
  );
}














