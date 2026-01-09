import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props){
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error){
    return { error }
  }
  componentDidCatch(error, info){
    // Could send to analytics
    console.error('ErrorBoundary caught', error, info)
  }
  render(){
    if(this.state.error){
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-white">
          <div className="bg-rose-700/10 border border-rose-600 p-6 rounded">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <pre className="whitespace-pre-wrap text-sm">{String(this.state.error)}</pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
