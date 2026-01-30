import { useEffect, useState } from 'react'
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { getIssues, createIssue, deleteIssue, updateIssue } from './api/issueService'
import KanbanColumn from './components/KanbanColumn'
import './App.css'

function App() {
  const [issues, setIssues] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  
  // Day 11: track which issue is being edited
  const [editingIssueId, setEditingIssueId] = useState(null)
  const [formData, setFormData] = useState({ title: '', description: '', project_id: 2, status: 'To Do' })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const loadIssues = () => {
    getIssues().then(setIssues).catch(err => console.error("Fetch error:", err))
  }

  useEffect(() => { loadIssues() }, [])

  const filteredIssues = issues.filter(issue => 
    issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Day 11: Trigger Edit Mode
  const handleEditClick = (issue) => {
    setEditingIssueId(issue.id)
    setFormData({ 
      title: issue.title, 
      description: issue.description, 
      project_id: issue.project_id, 
      status: issue.status 
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingIssueId(null)
    setFormData({ title: '', description: '', project_id: 2, status: 'To Do' })
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    if (!over) return

    const issueId = active.id
    const newStatus = over.id
    const issue = issues.find(i => i.id === issueId)

    if (issue && issue.status !== newStatus) {
      // Optimistic Update
      setIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: newStatus } : i))
      try {
        await updateIssue(issueId, { ...issue, status: newStatus })
      } catch (err) {
        loadIssues() 
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingIssueId) {
        // UPDATE Existing
        await updateIssue(editingIssueId, formData)
      } else {
        // CREATE New
        await createIssue(formData)
      }
      handleCloseModal()
      loadIssues()
    } catch (err) {
      console.error("Save failed:", err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      await deleteIssue(id)
      loadIssues()
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>🐞 Bug Tracker Kanban</h1>
          <p>Managing issues for <strong>Project ID: 2</strong></p>
        </div>
        <div className="header-actions">
          <input 
            type="text" className="search-bar" placeholder="Search bugs..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="add-button" onClick={() => setShowModal(true)}>+ New Issue</button>
        </div>
      </header>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <main className="kanban-board">
          {['To Do', 'In Progress', 'Done'].map(status => (
            <KanbanColumn 
              key={status}
              id={status}
              title={status} 
              issues={filteredIssues.filter(i => i.status === status || (!i.status && status === 'To Do'))} 
              onDelete={handleDelete}
              onEdit={handleEditClick} // Day 11: Pass edit handler
            />
          ))}
        </main>
      </DndContext>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingIssueId ? '✏️ Edit Issue' : '🚀 Report New Bug'}</h2>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" placeholder="Issue Title" required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
              <textarea 
                placeholder="Description" required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="submit-btn">
                  {editingIssueId ? 'Update Issue' : 'Create Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App