import Joint from './Analyzer/Joint'
import JointPair from './Analyzer/JointPair'
import Segment from './Analyzer/Segment'
import SegmentPair from './Analyzer/SegmentPair'

export default class Analyzer {
  constructor() {
    this.Joint = new Joint();
    this.JointPair = new JointPair();
    this.Segment = new Segment();
    this.SegmentPair = new SegmentPair();
  }
}
