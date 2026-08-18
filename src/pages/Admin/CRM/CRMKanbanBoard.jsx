import { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import axios from 'axios';
import toast from 'react-hot-toast';
import LeadCard from './LeadCard';
import LeadDetailsModal from './LeadDetailsModal';
import { SortableLeadCard } from './LeadCard';

const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];

const STAGE_COLORS = {
  New: 'border-blue-500 bg-blue-50',
  Contacted: 'border-purple-500 bg-purple-50',
  Qualified: 'border-indigo-500 bg-indigo-50',
  Proposal: 'border-orange-500 bg-orange-50',
  Negotiation: 'border-pink-500 bg-pink-50',
  Won: 'border-green-500 bg-green-50',
  Lost: 'border-red-500 bg-red-50'
};

const CRMKanbanBoard = ({ refreshTrigger, onRefresh, pipelineCounts }) => {
  const [leads, setLeads] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeLead, setActiveLead] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const fetchLeads = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('vertex_session_v1'))?.token;
      const { data } = await axios.get('http://127.0.0.1:5000/api/v1/admin/crm/leads?limit=500', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const grouped = STAGES.reduce((acc, stage) => {
        acc[stage] = [];
        return acc;
      }, {});

      data.data.forEach(lead => {
        if (grouped[lead.stage]) {
          grouped[lead.stage].push(lead);
        }
      });

      setLeads(grouped);
    } catch (error) {
      toast.error('Failed to load pipeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [refreshTrigger]);

  const handleDragStart = (event) => {
    const { active } = event;
    const stage = active.data.current.stage;
    const lead = leads[stage].find(l => l._id === active.id);
    setActiveLead(lead);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) return;

    const sourceStage = active.data.current.stage;
    const targetStage = over.data.current?.stage || over.id;

    if (sourceStage === targetStage) return;

    const leadId = active.id;
    
    // Optimistic UI update
    setLeads(prev => {
      const newSource = [...prev[sourceStage]];
      const newTarget = [...prev[targetStage]];
      const leadIndex = newSource.findIndex(l => l._id === leadId);
      const [movedLead] = newSource.splice(leadIndex, 1);
      
      movedLead.stage = targetStage;
      newTarget.push(movedLead);
      
      return {
        ...prev,
        [sourceStage]: newSource,
        [targetStage]: newTarget
      };
    });

    try {
      const token = JSON.parse(localStorage.getItem('vertex_session_v1'))?.token;
      await axios.patch(`http://127.0.0.1:5000/api/v1/admin/crm/leads/${leadId}/stage`, { stage: targetStage }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Lead moved to ${targetStage}`);
      onRefresh(); // Refresh counts and specific data
    } catch (error) {
      toast.error('Failed to move lead');
      fetchLeads(); // Revert on failure
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading Pipeline...</div>;
  }

  return (
    <div className="flex-1 flex overflow-x-auto bg-gray-50 p-6 gap-6 hide-scrollbar">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {STAGES.map(stage => (
          <div key={stage} className="flex-shrink-0 w-80 flex flex-col bg-gray-100/50 rounded-xl border border-gray-200/60 overflow-hidden">
            <div className={`p-4 border-t-4 ${STAGE_COLORS[stage]} bg-white flex justify-between items-center shadow-sm`}>
              <h3 className="font-bold text-gray-800">{stage}</h3>
              <span className="text-xs font-black bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                {leads[stage]?.length || 0}
              </span>
            </div>
            
            <div className="flex-1 p-3 overflow-y-auto min-h-[200px]" id={stage}>
              <SortableContext 
                id={stage}
                items={leads[stage]?.map(l => l._id) || []}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 min-h-[150px]">
                  {leads[stage]?.map(lead => (
                    <SortableLeadCard 
                      key={lead._id} 
                      lead={lead} 
                      stage={stage} 
                      onClick={() => setSelectedLead(lead)}
                    />
                  ))}
                  {(!leads[stage] || leads[stage].length === 0) && (
                    <div className="h-full w-full flex items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm font-medium">
                      Drop here
                    </div>
                  )}
                </div>
              </SortableContext>
            </div>
          </div>
        ))}
        
        <DragOverlay>
          {activeLead ? (
            <div className="opacity-80 rotate-2 scale-105 shadow-xl">
              <LeadCard lead={activeLead} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedLead && (
        <LeadDetailsModal 
          leadId={selectedLead._id} 
          onClose={() => setSelectedLead(null)}
          onUpdate={() => {
            fetchLeads();
            onRefresh();
          }}
        />
      )}
    </div>
  );
};

export default CRMKanbanBoard;
