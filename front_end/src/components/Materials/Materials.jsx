import React from 'react'
import AddMaterialForm from './AddMaterialForm'
import { useSelector } from 'react-redux'
import { Material } from '../index'
import { useState } from 'react'
import { Plus, Users } from 'lucide-react'

function Materials({siteId}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const allMaterials = useSelector((state) => state.material.materials);
  console.log(allMaterials);
  

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  const handleShowForm = () => {
    setShowAddForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Materials</h2>
            <p className="text-gray-600">
              {allMaterials?.length ? `${allMaterials.length} materials found` : 'No materials available'}
            </p>
          </div>
        </div>
        
        {!showAddForm && (
          <button
            onClick={handleShowForm}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Material</span>
          </button>
        )}
      </div>

      {/* Add Worker Form - Only show when needed */}
      {showAddForm && (
        <AddMaterialForm 
          siteId={siteId}
          onClose={handleCloseForm}
        />
      )}

      {/* Workers List */}
      {allMaterials && allMaterials.length > 0 ? (
        <div className="grid gap-4">
          {allMaterials.map(material => (
            <div key={material._id}>
              <Material
                key={material._id}
                id={material._id}
                name={material.materialName}
                quantity={material.quantity}
                unit={material.unit}
                costPerUnit={material.costPerUnit}
                totalCost={material.totalCost}
                purchasedDate={material.purchasedDate}
                sellerName={material.sellerName}
                vahicleNumber={material.vahicleNumber}
                createdAt={material.createdAt}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No material found</h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            There are no materials listed to this site yet. Add your first material to get started.
          </p>
          {!showAddForm && (
            <button
              onClick={handleShowForm}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add First material</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Materials
