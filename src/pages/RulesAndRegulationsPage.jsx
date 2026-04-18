import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FooterSection from '../components/FooterSection'

const RULES_SECTIONS = [
  {
    id: 'payment',
    title: '💰 Payment & Rent Rules',
    icon: '💳',
    rules: [
      {
        id: 'rent-due',
        title: 'Monthly Rent Payment',
        description: 'Rent for every month is due before 5th day of month. Late fees will be ₹100 per day. Please pay on time to avoid late fees.',
        important: true
      },
      {
        id: 'deposit-deduction',
        title: 'Deposit Refund Policy',
        description: 'A deposit of ₹1,000 will be deducted and remaining amount will be paid when leaving the room.',
        important: true
      },
      {
        id: 'no-refund',
        title: 'No Refund Policy',
        description: 'Once the deposit and rent amount is paid by the tenant, will not be returned in any circumstances.',
        important: true
      },
      {
        id: 'daily-charges',
        title: 'Extended Stay Charges',
        description: 'If you want to extend your stay after completion of 1st month, ₹300 per day will be charged. Daily basis time: 11:00 AM to next day 11:00 AM.',
        important: false
      },
      {
        id: 'partial-month',
        title: 'Partial Month Calculation',
        description: 'If you leave after 30 days and want to stay additional days in next month, those days will be charged at ₹300 per day basis, not prorated from monthly rent.',
        important: false
      }
    ]
  },
  {
    id: 'notice',
    title: '📋 Notice & Vacating Rules',
    icon: '📝',
    rules: [
      {
        id: 'vacating-notice',
        title: 'Vacating Notice Requirement',
        description: 'Vacating notice should be registered on website. Verbal notice will not be accepted. The deposit will be refunded only if notice is registered before 15 days.',
        important: true
      },
      {
        id: 'website-registration',
        title: 'Online Notice Mandatory',
        description: 'All notices must be submitted through HK PG website under "Complaints and Suggestions" section. Verbal or phone notices are not valid.',
        important: true
      }
    ]
  },
  {
    id: 'security',
    title: '🔒 Security & Safety Rules',
    icon: '🛡️',
    rules: [
      {
        id: 'valuables',
        title: 'Valuables Security',
        description: 'Paying guests should keep their valuables in cupboards & lockers. Management is not responsible for any loss or theft.',
        important: true
      },
      {
        id: 'personal-belongings',
        title: 'Personal Belongings Disclaimer',
        description: 'HK PG will not be responsible for the loss of any personal belongings. Residents are strongly advised to keep secure and lock all valuables (mobile phones, laptop, watches, money etc.) at all times. While leaving the room, ensure all belongings are securely stored in cupboards.',
        important: true
      },
      {
        id: 'keys-responsibility',
        title: 'Keys & Locks Policy',
        description: 'Residents must keep room and wardrobe keys safe. In case of loss, replacement cost will be borne by resident. Changing locks is not allowed.',
        important: false
      },
      {
        id: 'prohibited-items',
        title: 'Prohibited Items',
        description: 'Possession, distribution and use of firearms, lethal weapons (including air guns), illegal substances and hazardous materials are strictly prohibited. Management reserves right to search bags and confiscate prohibited items.',
        important: true
      }
    ]
  },
  {
    id: 'conduct',
    title: '👥 Conduct & Behavior Rules',
    icon: '⚖️',
    rules: [
      {
        id: 'violence',
        title: 'Violence Policy',
        description: 'In case of violence, all rights reserved to PG management to take action.',
        important: true
      },
      {
        id: 'opposite-gender',
        title: 'Opposite Gender Policy',
        description: 'Opposite gender are not allowed to enter premises/rooms of PG. If found, it will be considered misbehavior and management will ask the person to vacate immediately. Rent & deposit will not be refunded.',
        important: true
      },
      {
        id: 'behavior',
        title: 'General Conduct',
        description: 'Residents should not behave in any manner deemed offensive by neighbors or society, either in premises or surrounding areas.',
        important: false
      },
      {
        id: 'police-engagement',
        title: 'Police Encounters',
        description: 'Residents shall immediately inform HK PG Representative for any engagements or encounters with Police.',
        important: true
      }
    ]
  },
  {
    id: 'visitors',
    title: '👥 Visitors & Guests Rules',
    icon: '🚪',
    rules: [
      {
        id: 'visitor-permission',
        title: 'Visitor Permission',
        description: 'Outsiders not allowed without permission. Visitors must enter name in guest register and show valid ID & address proof to management.',
        important: true
      },
      {
        id: 'guest-charges',
        title: 'Guest Accommodation',
        description: 'Guest accommodation charges: ₹400 per day.',
        important: false
      },
      {
        id: 'visitor-responsibility',
        title: 'Visitor Liability',
        description: 'Resident will be wholly responsible and financially liable for all actions of their visitors and guests.',
        important: true
      }
    ]
  },
  {
    id: 'facilities',
    title: '🏠 Facilities & Maintenance Rules',
    icon: '🔧',
    rules: [
      {
        id: 'electrical-appliances',
        title: 'Electrical Appliances',
        description: 'Usage of heaters, coils, iron boxes or any heating/cooking electrical gadgets is strictly prohibited inside rooms. Switch off all lights, fans, ACs, geysers when leaving.',
        important: true
      },
      {
        id: 'washing-machine',
        title: 'Washing Machine Usage',
        description: 'Do not overload washing machines. Unload clothes immediately after usage. HK PG not responsible for unclaimed clothes.',
        important: false
      },
      {
        id: 'water-usage',
        title: 'Water Conservation',
        description: 'Water should be used judiciously. Report any water leakages to management immediately.',
        important: false
      },
      {
        id: 'maintenance-access',
        title: 'Maintenance Access',
        description: 'HK PG reserves right to enter any room during resident absence for maintenance work, carried out in presence of HK PG representatives.',
        important: false
      },
      {
        id: 'housekeeping',
        title: 'Housekeeping Policy',
        description: 'Regular housekeeping may be carried out in resident absence. Keep valuables secured and rooms locked. Do not leave valuables open.',
        important: false
      }
    ]
  },
  {
    id: 'emergency',
    title: '🚨 Emergency & Crisis Rules',
    icon: '⚠️',
    rules: [
      {
        id: 'emergency-guidelines',
        title: 'Emergency Procedures',
        description: 'In case of any emergency or crisis, residents must follow guidelines of HK PG Management/Nodal Officer strictly.',
        important: true
      },
      {
        id: 'complaints',
        title: 'Feedback & Complaints',
        description: 'Residents are required to share feedback/submit queries/raise complaints on HK PG website under "Complaints and Suggestions" section.',
        important: false
      }
    ]
  }
]

function RuleCard({ rule, sectionIcon }) {
  return (
    <div className={`bg-white rounded-xl p-4 border-l-4 ${rule.important ? 'border-red-500 bg-red-50' : 'border-blue-500'} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{sectionIcon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-gray-800 text-sm">{rule.title}</h3>
            {rule.important && (
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                IMPORTANT
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{rule.description}</p>
        </div>
      </div>
    </div>
  )
}

function SectionCard({ section, isExpanded, onToggle }) {
  const importantCount = section.rules.filter(rule => rule.important).length
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-3xl">{section.icon}</span>
            <div>
              <h2 className="text-lg font-bold text-gray-800">{section.title}</h2>
              <p className="text-sm text-gray-500">
                {section.rules.length} rules • {importantCount} important
              </p>
            </div>
          </div>
          <span className={`text-2xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ⌄
          </span>
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-6 pb-6 space-y-3">
          {section.rules.map(rule => (
            <RuleCard key={rule.id} rule={rule} sectionIcon={section.icon} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function RulesAndRegulationsPage() {
  const [expandedSections, setExpandedSections] = useState(new Set(['payment', 'notice', 'security']))
  const navigate = useNavigate()

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const expandAll = () => {
    setExpandedSections(new Set(RULES_SECTIONS.map(s => s.id)))
  }

  const collapseAll = () => {
    setExpandedSections(new Set())
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}>
      
      {/* Header */}
      <div className="w-full px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-4">
            MANDATORY READING
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            📋 Rules & <span className="text-red-600">Regulations</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Please read all rules carefully before booking. Acceptance of these rules is mandatory for accommodation.
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <button
              onClick={expandAll}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-200 transition"
            >
              📖 Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
            >
              📑 Collapse All
            </button>
            <button
              onClick={() => navigate('/accommodation')}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-bold hover:opacity-90 transition"
            >
              🏠 Back to Rooms
            </button>
          </div>

          {/* Important notice */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-bold text-red-800 mb-2">Important Notice</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• All rules are legally binding and must be followed</li>
                  <li>• Violation may result in immediate termination without refund</li>
                  <li>• Rules acceptance is mandatory before booking confirmation</li>
                  <li>• Management reserves right to update rules with prior notice</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Sections */}
      <div className="w-full px-4 sm:px-6 pb-16">
        <div className="max-w-4xl mx-auto space-y-4">
          {RULES_SECTIONS.map(section => (
            <SectionCard
              key={section.id}
              section={section}
              isExpanded={expandedSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="w-full px-4 sm:px-6 pb-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to Book Your Room?
          </h3>
          <p className="text-gray-600 mb-6">
            By proceeding with booking, you acknowledge that you have read and agree to all the above rules and regulations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/accommodation')}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
            >
              🏠 View Available Rooms
            </button>
            <button
              onClick={() => window.open('tel:+919579828996', '_self')}
              className="px-8 py-3 bg-white border-2 border-purple-300 text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all"
            >
              📞 Call for Clarification
            </button>
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  )
}