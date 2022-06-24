package com.osts.models;

import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "trackingsystem")
public class TrackingSystem {

	@Id
	@GeneratedValue(strategy =  GenerationType.IDENTITY)
	private long id;

	@Column(name = "name")
	private String name;

	@Column(name = "state")
	private String state;
	
	@Column(name = "license")
	private String license;

	@Column(name = "url")
	private String url;

	@Column(name = "description")
	private String description;
	
	@Column(name = "date")
	private Date date;

	@Column(name="active")
	private Boolean active = true;

	@ManyToOne
	@JoinColumn(name = "created_by_id", referencedColumnName = "id")
	private User createdUser;

	@ManyToOne
	@JoinColumn(name = "updated_by_id", referencedColumnName = "id")
	private User updatedUser;

	@Column(name = "updated_date")
	private Date updatedDate;
}
